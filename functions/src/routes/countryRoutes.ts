import express from 'express';
import countryController from '../controllers/countryController';

const router = express.Router();

router.get('/', countryController.getCountries);
router.post('/', countryController.createCountry);
router.put('/:id',  countryController.updateCountry);
router.delete('/:id', countryController.deleteCountry);

export default router;
