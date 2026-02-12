const excelUploadService = require('../../services/upload/excelUploadService');

const uploadExcel = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Use multipart/form-data with field name "file".'
      });
    }
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'User organization not set.'
      });
    }
    const result = await excelUploadService.uploadExcel(req.file.buffer, organizationId);
    const status = result.success ? 200 : 207;
    return res.status(status).json({
      success: result.success,
      message: result.success ? 'Import successful' : 'Import completed with errors',
      data: {
        imported: result.imported,
        parsed_counts: result.parsed_counts
      },
      ...(result.errors && result.errors.length ? { errors: result.errors } : {})
    });
  } catch (error) {
    next(error);
  }
};

const deleteExcelData = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'User organization not set.'
      });
    }
    const deleted = await excelUploadService.deleteAllExcelData(organizationId);
    return res.status(200).json({
      success: true,
      message: 'All Excel data deleted for your organization.',
      data: { deleted }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadExcel,
  deleteExcelData
};
