import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const dirPath = path.join(process.cwd(), "src/assets/images");

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function identify() {
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith("ChatGPT Image") && f.endsWith(".png"));
  console.log("Found files to analyze:", files);

  // Load existing mapping if any
  const mappingPath = path.join(process.cwd(), "src/assets/images/mapping.json");
  let results: { file: string; label: string; description: string }[] = [];
  if (fs.existsSync(mappingPath)) {
    try {
      results = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
    } catch (e) {
      results = [];
    }
  }

  for (const file of files) {
    // Skip if already analyzed
    if (results.some(r => r.file === file)) {
      console.log(`Already analyzed ${file}, skipping.`);
      continue;
    }

    const filePath = path.join(dirPath, file);
    const data = fs.readFileSync(filePath);
    const base64Data = data.toString("base64");

    const prompt = `Analyze this image of Kokouvi Wash (a professional laundry and pressing business in Lomé, Togo) and classify it into EXACTLY ONE of these 5 categories:
1. "frontstore_exterior" (The outside storefront, showing the blue and white wall with the window and door)
2. "reception_counter" (The indoor reception counter/desk with a grey laminate finish, wood/gold trim, and the yellow Kokouvi Wash sign reading "PRESSING Nettoyage-Blanchisserie-Repassage")
3. "ironing_table" (The workshop area showing wooden tables covered with white/cream cloths, with steam irons resting on small stools/tables, and clothes hanging on rails)
4. "washing_machines" (The laundry room showing a large industrial silver IPSO washing machine and another washing machine with suitcases stacked on top of it)
5. "reception_interior" (An interior view of the reception/shop, showing a long countertop, with shelves underneath storing neatly folded blue and white linen, a ceiling fan, and maybe a security monitor screen on the wall)

Respond in JSON format with two fields:
"category": The category name (one of: frontstore_exterior, reception_counter, ironing_table, washing_machines, reception_interior)
"description": A very brief 1-sentence description in French of what is in the image to verify.`;

    let success = false;
    let attempts = 0;
    const model = "gemini-3.1-flash-lite";

    while (!success && attempts < 3) {
      attempts++;
      console.log(`Analyzing ${file} with ${model} (attempt ${attempts}/3)...`);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png",
              },
            },
            {
              text: prompt,
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        const resText = response.text || "{}";
        const parsed = JSON.parse(resText.trim());
        console.log(`SUCCESS => File: ${file} => Category: ${parsed.category} | Description: ${parsed.description}`);
        results.push({ file, label: parsed.category, description: parsed.description });
        // Save immediately
        fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
        success = true;
      } catch (error: any) {
        console.error(`Error on attempt ${attempts} for ${file}:`, error.message || error);
        console.log("Waiting 10 seconds before retrying...");
        await sleep(10000);
      }
    }

    if (!success) {
      console.error(`FAILED TO ANALYZE ${file} after 3 attempts with ${model}.`);
    }

    // Cooldown
    await sleep(10000);
  }

  console.log("Analysis complete. Mapping is:", results);
}

identify();
