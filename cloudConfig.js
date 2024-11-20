const cloudinary = require("cloudinary").v2; // Ensure you are using v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "2020Technologies",
      resource_type: "raw",
      format: file.originalname.split(".").pop(),
      allowedFormats: ["pdf", "doc", "docx", "rtf"],
    };
  },
});
module.exports = {
  cloudinary,
  storage,
};
