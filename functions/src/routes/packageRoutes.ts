import express from 'express';
import packageController from '../controllers/packageController';

const router = express.Router();

router.get('/', packageController.getPackages);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

export default router;
