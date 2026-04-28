import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "State" for the prototype
  let citizens: any[] = [
    {
      id: "YE-882-991",
      name: "علي أحمد صالح",
      birthDate: "1985-05-12",
      origin: "تعز، شرعب السلام",
      voiceHash: "v_sig_classic_882",
      createdAt: new Date().toISOString(),
    },
    {
      id: "YE-450-210",
      name: "أروى محمد القاسمي",
      birthDate: "1992-11-20",
      origin: "صنعاء، الأمانة",
      voiceHash: "v_sig_classic_450",
      createdAt: new Date().toISOString(),
    }
  ];

  // AI API Route (Simulated logic for Voice Biometrics)
  app.post("/api/ai/verify-voice", async (req, res) => {
    const { citizenId, voiceHash } = req.body;
    const citizen = citizens.find(c => c.id === citizenId);

    if (!citizen) {
       return res.status(404).json({ success: false, message: "Citizen not found" });
    }

    // Simulate Deep Analysis
    await new Promise(r => setTimeout(r, 2000));

    // For demo purposes, we accept any recording as a match for the target
    res.json({ 
      success: true, 
      matchScore: 0.96 + Math.random() * 0.03, 
      method: "Spectral Matching",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/citizens", (req, res) => {
    res.json(citizens);
  });

  app.post("/api/citizens", (req, res) => {
    const newCitizen = {
      ...req.body,
      id: `YE-${Math.floor(100+Math.random()*900)}-${Math.floor(100+Math.random()*900)}`,
      createdAt: new Date().toISOString()
    };
    citizens.push(newCitizen);
    res.status(201).json(newCitizen);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Hawiyati Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
