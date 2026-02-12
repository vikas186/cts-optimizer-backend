const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../../controllers/upload/uploadController');
const { authenticate } = require('../../middleware/auth/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowed.includes(file.mimetype) || /\.(xlsx|xls)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed.'), false);
    }
  }
});

/**
 * @swagger
 * /api/upload/excel:
 *   post:
 *     summary: Upload Excel (CTS template) — sole data import (XL-only flow)
 *     description: |
 *       **XL-only flow:** This is the only way to import CTS data. Upload a workbook with sheets
 *       `warehouse_costs`, `transport_costs`, and `orders`. Customers and routes are created automatically
 *       from IDs referenced in the file. Use multipart/form-data with field name `file` (Excel .xlsx or .xls).
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx or .xls)
 *     responses:
 *       200:
 *         description: Import successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Import successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: object
 *                       properties:
 *                         warehouse_costs:
 *                           type: integer
 *                         transport_costs:
 *                           type: integer
 *                         orders:
 *                           type: integer
 *                     parsed_counts:
 *                       type: object
 *                       properties:
 *                         warehouse_costs:
 *                           type: integer
 *                         transport_costs:
 *                           type: integer
 *                         orders:
 *                           type: integer
 *       207:
 *         description: Partial import (some sheets failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Import completed with errors
 *                 data:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: object
 *                     parsed_counts:
 *                       type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sheet:
 *                         type: string
 *                       message:
 *                         type: string
 *       400:
 *         description: No file or invalid file type
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/excel', authenticate, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message || 'File upload failed.' });
    }
    next();
  });
}, uploadController.uploadExcel);

/**
 * @swagger
 * /api/upload/excel-data:
 *   delete:
 *     summary: Delete all Excel data for your organization
 *     description: |
 *       Permanently deletes all data that was imported via Excel (or can be) for the current user's organization:
 *       cost_results, drop_size_results, orders, transport_costs, warehouse_costs, routes, customers.
 *       Use this to clear data before a fresh upload or to reset.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All Excel data deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All Excel data deleted for your organization.
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleted:
 *                       type: object
 *                       properties:
 *                         cost_results:
 *                           type: integer
 *                         drop_size_results:
 *                           type: integer
 *                         orders:
 *                           type: integer
 *                         transport_costs:
 *                           type: integer
 *                         warehouse_costs:
 *                           type: integer
 *                         routes:
 *                           type: integer
 *                         customers:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/excel-data', authenticate, uploadController.deleteExcelData);

module.exports = router;
