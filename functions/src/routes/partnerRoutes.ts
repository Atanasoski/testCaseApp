import express from 'express';
import partnerController from '../controllers/partnerController';

const router = express.Router();

// Get pricing for a specific package of a partner across countries, with currency conversion
router.get('/:partnerId/packages/:packageId/pricing', partnerController.getPackagePricingForPartner);

router.get('/packages', partnerController.getPartnersPackages);
router.get('/:id/packages', partnerController.getPartnerPackages);
router.post('/', partnerController.createPartner);
router.post('/pricing', partnerController.updatePartnerPricing);
router.delete('/:id', partnerController.deletePartner);

export default router;
