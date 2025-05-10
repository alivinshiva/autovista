import mongoose from 'mongoose'
import { GridFsStorage } from 'multer-gridfs-storage'
import multer from 'multer'
import Grid from 'gridfs-stream'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autovisa'

// Initialize GridFS storage
const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'glbModels',
      filename: file.originalname,
      metadata: {
        modelName: req.body.modelName,
        slug: req.body.slug
      }
    }
  }
})

// Create multer upload instance
export const upload = multer({ storage })

// Initialize GridFS stream
let gfs: any
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo)
  gfs.collection('glbModels')
})

// Function to get file by filename
export const getFile = async (filename: string) => {
  try {
    const file = await gfs.files.findOne({ filename })
    if (!file) {
      throw new Error('File not found')
    }
    return file
  } catch (error) {
    throw error
  }
}

// Function to create read stream
export const createReadStream = (filename: string) => {
  return gfs.createReadStream(filename)
}

export default storage 