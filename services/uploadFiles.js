import { join } from "path";
import { promises as fs } from "fs";
import multer from "multer";

const uploadDir = join(process.cwd(), "temp");
const storeImage = join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

const saveFile = async (userId, file) => {
  const { path: temporaryName, originalname } = file;
  const newFileName = userId + "_" + originalname;
  const resolvedName = join(storeImage, newFileName);

  try {
    await fs.rename(temporaryName, resolvedName);
    return `/avatars/${newFileName}`;
  } catch (err) {
    await fs.unlink(temporaryName);
    throw err;
  }
};

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const createDefaultFolders = async () => {
  createFolderIsNotExist(uploadDir);
  createFolderIsNotExist(storeImage);
};

export { createDefaultFolders, upload, saveFile };
