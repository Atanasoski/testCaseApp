import { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Country } from '../types/country';

class countryController {
    
    public static async getCountries(req: Request, res: Response) {
        try {
            const countryCollection = collection(db, "countries");
            const countrySnapshot = await getDocs(countryCollection);
            const countries = countrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Country));
            return res.status(200).json({countries});
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch countries' });
        }
    }

    public static async createCountry(req: Request, res: Response) {
        const { name } = req.body;
        try {
            await addDoc(collection(db, "countries"), { name });
            return res.status(201).json({ message: 'Document created successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create country' });
        }
    }

    public static async updateCountry(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const packageDoc = doc(db, "countries", id);
            await updateDoc(packageDoc, { name });
            return res.status(200).json({ message: 'Document updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update document' });
        }
    }

    public static async deleteCountry(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const countryDoc = doc(db, "countries", id);
            const docSnapshot = await getDoc(countryDoc);
    
            // Check if the document exists
            if (!docSnapshot.exists()) {
                return res.status(404).json({ error: 'Country not found' });
            }
    
            await deleteDoc(countryDoc); 
            return res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete document' });
        }
    }
    
}

export default countryController;
