import express from "express";
import { rawBodyJson, test } from "../middlewares/rawBody.middleware.js";
import { handleWebhook } from "../controllers/webhook.controller.js";
import { listRichMenus } from "../services/richmenu.service.js";

const router = express.Router();

router.post("/", rawBodyJson, handleWebhook);

router.post('/healthz', express.json(), (req, res) => {
    return res.status(200).json(req.headers)
})

// Helper function to find rich menu by name (partial match)
async function findRichMenuByName(searchName) {
    const response = await listRichMenus();
    const richmenus = response.data.richmenus || [];
    return richmenus.find(menu => 
        menu.name.toLowerCase().includes(searchName.toLowerCase())
    );
}

// GET /webhook/richmenus - List all rich menus
router.get('/richmenus', async (req, res) => {
    try {
        const response = await listRichMenus();
        return res.status(200).json({
            success: true,
            count: response.data.richmenus?.length || 0,
            richmenus: response.data.richmenus || []
        });
    } catch (error) {
        console.error('Error listing rich menus:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /webhook/richmenus/restaurant - Get restaurant rich menu (ร้านอาหาร)
router.get('/richmenus/restaurant', async (req, res) => {
    try {
        const menu = await findRichMenuByName('ร้านอาหาร');
        if (!menu) {
            return res.status(404).json({
                success: false,
                error: 'Rich menu "ร้านอาหาร" not found'
            });
        }
        return res.status(200).json({
            success: true,
            richmenu: menu
        });
    } catch (error) {
        console.error('Error getting restaurant rich menu:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /webhook/richmenus/helpme - Get helpme rich menu
router.get('/richmenus/helpme', async (req, res) => {
    try {
        const menu = await findRichMenuByName('helpme');
        if (!menu) {
            return res.status(404).json({
                success: false,
                error: 'Rich menu "helpme" not found'
            });
        }
        return res.status(200).json({
            success: true,
            richmenu: menu
        });
    } catch (error) {
        console.error('Error getting helpme rich menu:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
