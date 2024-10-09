import { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Package } from '../types/package';

class packageController {

    public static async createPackage(req: Request, res: Response) {
        const { name, country, partner, size, price, type } = req.body;
        try {
            await addDoc(collection(db, "packages"), { name, country, partner, size, price, type });
            return res.status(201).json({ message: 'Document created successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create package' });
        }
    }

    public static async getPackages(req: Request, res: Response) {
        try {
            const packageCollection = collection(db, "packages");
            const packageSnapshot = await getDocs(packageCollection);
            const packages = packageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
            return res.status(200).json(packages);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch packages' });
        }
    }

    public static async updatePackage(req: Request, res: Response) {
        const { id } = req.params;
        const { name, country, partner, size, price, type } = req.body;
        try {
            const packageDoc = doc(db, "packages", id);
            await updateDoc(packageDoc, { name, country, partner, size, price, type });
            return res.status(200).json({ message: 'Document updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update package' });
        }
    }

    public static async deletePackage(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const packageDoc = doc(db, "packages", id);
            await deleteDoc(packageDoc);
            return res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete document' });
        }
    }
    
}

export default packageController;
