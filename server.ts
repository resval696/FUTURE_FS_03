import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone doit comporter au moins 8 chiffres"),
  message: z.string().min(5, "Le message doit comporter au moins 5 caractères"),
});

const pickupSchema = z.object({
  customerName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone doit comporter au moins 8 chiffres"),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  preferredDate: z.string().min(1, "Veuillez sélectionner une date préférée"),
  preferredTime: z.string().min(1, "Veuillez sélectionner un créneau horaire"),
  specialInstructions: z.string().optional().nullable(),
});

const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

const quoteSchema = z.object({
  customerName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone doit comporter au moins 8 chiffres"),
  items: z.string().min(2, "Veuillez sélectionner au moins un article"),
  estimatedTotal: z.number().nonnegative(),
});

// ==========================================
// BUSINESS STATUS ENDPOINT (Lomé, Togo is UTC/GMT+0)
// ==========================================
app.get("/api/status", (req, res) => {
  // Togo is UTC+0, so Date.getUTCDay() and Date.getUTCHours() are accurate
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();

  const currentTimeMinutes = hour * 60 + minute;
  const openTimeMinutes = 7 * 60;  // 07:00 AM
  const closeTimeMinutes = 20 * 60; // 08:00 PM

  let isOpen = false;
  if (day !== 0) { // Mon-Sat
    if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
      isOpen = true;
    }
  }

  res.json({
    isOpen,
    timezone: "Africa/Lome",
    currentDay: day,
    currentHour: hour,
    currentMinute: minute,
    workingHours: "Monday - Saturday: 07:00 AM - 08:00 PM (GMT), Sunday: Closed",
  });
});

// ==========================================
// PUBLIC REST API ENDPOINTS
// ==========================================

// POST /api/contact
app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    const request = await prisma.contactRequest.create({
      data: validatedData,
    });
    return res.status(201).json({
      success: true,
      message: "Contact request received successfully.",
      data: request,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    console.error("Error creating contact request:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// POST /api/pickups
app.post("/api/pickups", async (req, res) => {
  try {
    const validatedData = pickupSchema.parse(req.body);
    const reservation = await prisma.pickupReservation.create({
      data: {
        customerName: validatedData.customerName,
        phone: validatedData.phone,
        address: validatedData.address,
        preferredDate: validatedData.preferredDate,
        preferredTime: validatedData.preferredTime,
        specialInstructions: validatedData.specialInstructions || "",
      },
    });
    return res.status(201).json({
      success: true,
      message: "Pickup reservation scheduled successfully.",
      data: reservation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    console.error("Error creating pickup reservation:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// POST /api/newsletter
app.post("/api/newsletter", async (req, res) => {
  try {
    const validatedData = newsletterSchema.parse(req.body);
    
    // Check if email already subscribed to avoid SQLite unique constraint violation crash
    const existing = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to our newsletter!",
        data: existing,
      });
    }

    const subscription = await prisma.newsletter.create({
      data: validatedData,
    });
    return res.status(201).json({
      success: true,
      message: "Subscribed to newsletter successfully.",
      data: subscription,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    console.error("Error in newsletter subscription:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// POST /api/quotes
app.post("/api/quotes", async (req, res) => {
  try {
    const validatedData = quoteSchema.parse(req.body);
    const quote = await prisma.quoteRequest.create({
      data: validatedData,
    });
    return res.status(201).json({
      success: true,
      message: "Quote calculation saved successfully.",
      data: quote,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    console.error("Error saving quote request:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// GET /api/pickups/track - Public tracking endpoint
app.get("/api/pickups/track", async (req, res) => {
  try {
    const { phone, id } = req.query;

    if (!phone && !id) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un numéro de téléphone ou un numéro de suivi.",
      });
    }

    let list = [];

    // Helper to normalize phone number by keeping only digits
    const normalizePhone = (num: string): string => {
      return num.replace(/\D/g, "");
    };

    if (id) {
      const numericId = parseInt(id as string, 10);
      if (!isNaN(numericId)) {
        const item = await prisma.pickupReservation.findUnique({
          where: { id: numericId },
        });
        if (item) {
          list.push(item);
        }
      }
      
      // If no item found by ID and the id query actually looks like a phone number, fallback to searching by phone
      if (list.length === 0 && (id as string).length >= 5) {
        const queryPhone = (id as string).trim();
        const normQuery = normalizePhone(queryPhone);
        
        if (normQuery.length >= 4) {
          const allReservations = await prisma.pickupReservation.findMany({
            orderBy: { createdAt: "desc" },
          });
          
          list = allReservations.filter((resv) => {
            const normDb = normalizePhone(resv.phone);
            if (!normDb || !normQuery) return false;
            
            // Match last 8 digits (extremely common for African/Togo phone numbers format differences)
            const dbLast8 = normDb.slice(-8);
            const queryLast8 = normQuery.slice(-8);
            if (dbLast8.length >= 6 && dbLast8 === queryLast8) return true;
            
            // Substring matching
            return normDb.includes(normQuery) || normQuery.includes(normDb);
          });
        }
      }
    } else if (phone) {
      const cleanPhone = (phone as string).trim();
      const normQuery = normalizePhone(cleanPhone);
      
      // Try direct database containing match first
      const directMatches = await prisma.pickupReservation.findMany({
        where: {
          phone: {
            contains: cleanPhone,
          },
        },
        orderBy: { createdAt: "desc" },
      });
      
      if (directMatches.length > 0) {
        list = directMatches;
      } else {
        // Fallback to normalized database matching
        const allReservations = await prisma.pickupReservation.findMany({
          orderBy: { createdAt: "desc" },
        });
        
        list = allReservations.filter((resv) => {
          const normDb = normalizePhone(resv.phone);
          if (!normDb || !normQuery) return false;
          
          // Match last 8 digits
          const dbLast8 = normDb.slice(-8);
          const queryLast8 = normQuery.slice(-8);
          if (dbLast8.length >= 6 && dbLast8 === queryLast8) return true;
          
          // Substring matching
          return normDb.includes(normQuery) || normQuery.includes(normDb);
        });
      }
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error tracking pickups:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la recherche de vos collectes.",
    });
  }
});

// POST /api/admin/pickups/:id/status - Update reservation status
app.post("/api/admin/pickups/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["en attente", "en cours", "complétée"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide. Choisissez parmi: 'en attente', 'en cours', 'complétée'.",
      });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: "ID de collecte invalide." });
    }

    const updated = await prisma.pickupReservation.update({
      where: { id: numericId },
      data: { status },
    });

    return res.json({
      success: true,
      message: "Statut mis à jour avec succès.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating pickup status:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du statut.",
    });
  }
});

// ==========================================
// ADMIN ARCHITECTURE PREPARATION (Future modules)
// ==========================================
app.get("/api/admin/contacts", async (req, res) => {
  try {
    // In future, implement token or session verification here
    const list = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving contacts" });
  }
});

app.get("/api/admin/pickups", async (req, res) => {
  try {
    const list = await prisma.pickupReservation.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving pickups" });
  }
});

app.get("/api/admin/quotes", async (req, res) => {
  try {
    const list = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving quotes" });
  }
});

app.get("/api/admin/newsletter", async (req, res) => {
  try {
    const list = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving newsletter list" });
  }
});

// Admin stats placeholder for future dashboard expansion
app.get("/api/admin/stats", async (req, res) => {
  try {
    const contactsCount = await prisma.contactRequest.count();
    const pickupsCount = await prisma.pickupReservation.count();
    const quotesCount = await prisma.quoteRequest.count();
    const newsletterCount = await prisma.newsletter.count();

    res.json({
      success: true,
      data: {
        contacts: contactsCount,
        pickups: pickupsCount,
        quotes: quotesCount,
        newsletter: newsletterCount,
        futureDashboardModules: [
          "Customer Dashboard",
          "Admin Dashboard",
          "Order Tracking",
          "Pickup Management",
          "Quote Management",
          "Real-time Statistics",
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error compiling statistics" });
  }
});

// ==========================================
// VITE DEV SERVER & PRODUCTION ROUTING
// ==========================================
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startViteServer();
