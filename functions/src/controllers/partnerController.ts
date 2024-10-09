import { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';

import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, where, query } from 'firebase/firestore';
import { Partner } from '../types/partner';
import { Package } from '../types/package';
import { Country } from '../types/country';
import PricingService from '../services/pricingService';

class partnerController {

    public static async createPartner(req: Request, res: Response) {
        const { name, packages } = req.body;
        try {
            // Fetch each package by its ID
            const packagesArr = await Promise.all(
                packages.map(async (packageId: string) => {
                    const packageDocRef = doc(db, "packages", packageId);
                    return packageDocRef;
                })
            );

            await addDoc(collection(db, "partners"), { name, "packages":packagesArr });
    
            return res.status(201).json({ message: 'Document created successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create partner' });
        }
    }

    // Get all partners with their package details
    public static async getPartnersPackages(req: Request, res: Response) {
        try {
            const partnerCollection = collection(db, "partners");
            const partnerSnapshot = await getDocs(partnerCollection);

            const partners = await Promise.all(partnerSnapshot.docs.map(async (partnerDoc) => {
                const partnerData = partnerDoc.data();
                const packagesData = [];
                
                // Check if the partner has packages
                if (partnerData.packages && partnerData.packages.length > 0) {
                    // Loop through the packages array and fetch each package document
                    for (const packageRef of partnerData.packages) {
                        const packageDocument = await getDoc(packageRef)
                        const pacakgeData = packageDocument.data() as Package
                        
                        const countryDocument = await getDoc(pacakgeData.country)
                        const countryData = countryDocument.data() as Country
                        
                        packagesData.push({
                            id: pacakgeData.id,
                            size: pacakgeData.size,
                            name: pacakgeData.name,
                            price: pacakgeData.price,
                            type: pacakgeData.type,
                            country: {
                                name: countryData.name,
                            },
                        });
                    }
                }

                // Return partner data along with its packages
                return { 
                    id: partnerData.id, 
                    name: partnerData.name,
                    package: packagesData 
                };
            }));

            return res.status(200).json(partners);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to fetch partners' });
        }
    }

    public static async getPartnerPackages(req: Request, res: Response) {
        const {id} = req.params
        try {
            const partnerCollection = doc(db, "partners", id);
            const partnerSnapshot = await getDoc(partnerCollection);

            if (!partnerSnapshot.exists()) {
                return res.status(404).json({ error: 'Partner not found' });
            }
            
            const partnerData = partnerSnapshot.data() as Partner;
            const packagesData = [];
            
            // Check if the partner has packages
            if (partnerData.packages && partnerData.packages.length > 0) {
                // Loop through the packages array and fetch each package document
                for (const packageRef of partnerData.packages) {
                    const packageDocument = await getDoc(packageRef)
                    const pacakgeData = packageDocument.data() as Package
                    
                    const countryDocument = await getDoc(pacakgeData.country)
                    const countryData = countryDocument.data() as Country
                    
                    packagesData.push({
                        id: pacakgeData.id,
                        size: pacakgeData.size,
                        name: pacakgeData.name,
                        price: pacakgeData.price,
                        type: pacakgeData.type,
                        country: {
                            name: countryData.name,
                        },
                    });
                }
            }

            const responseData = { 
                id: partnerData.id, 
                name: partnerData.name,
                package: packagesData 
            }

            // Return partner data along with its packages
            return res.status(200).json(responseData);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to fetch partners' });
        }
    }

    public static async updatePartnerPricing(req: Request, res: Response) {
        const { partnerId, packageId, price } = req.body;

        try {
            const partnerCollection = doc(db, "partners", partnerId);
            const partnerSnapshot = await getDoc(partnerCollection);

            if (!partnerSnapshot.exists()) {
                return res.status(404).json({ error: 'Partner not found' });
            }

            //We fetch the package by the id
            const packageDoc = doc(db, "packages", packageId);
            const packageSnapshot = await getDoc(packageDoc);

            if (!packageSnapshot.exists()) {
                return res.status(404).json({ error: 'Package not found' });
            }

            const pacakgeData = packageSnapshot.data() as Package

            // Check if the package is assigned to a partner
            if(pacakgeData.partner) {
                // if NOT NULL check if the assigned partner matches the partnerId from the request
                if(pacakgeData.partner.id != partnerId) {
                    return res.status(500).json({ error: 'Package does not belong to partner' });
                }

                // If the partner matches, update the price   
                await updateDoc(packageDoc, { price });
                return res.status(200).json({ message: 'Document updated successfully' });
                
            } else {
            // If the package has no partner, create a new package associated with the partner with the custom price

            const packageData = { 
                    name: pacakgeData.name, 
                    country: pacakgeData.country, 
                    size: pacakgeData.size, 
                    price: price, 
                    type: 'custom',
                    partner: partnerCollection
                };

                await addDoc(collection(db, "packages"), packageData);
            }
        
            return res.status(201).json({ message: 'Document created successfully' });

        } catch (error) {
            return res.status(500).json({ error: 'Failed to update partner pricing' });
        }
    }

    public static async deletePartner(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const partnerDoc = doc(db, "partners", id);
            await deleteDoc(partnerDoc);
            return res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete partner' });
        }
    }

    // get pricing for all packages of a partner across multiple countries
    public static async getPackagePricingForPartner(req: Request, res: Response) {
        const { partnerId, packageId } = req.params;
        const targetCurrency = (req.query.currency as string)?.toUpperCase();
    
        try {
            // Fetch partner document
            const partnerRef = doc(db, 'partners', partnerId);
            const partnerSnapshot = await getDoc(partnerRef);

            if (!partnerSnapshot.exists()) {
                return res.status(404).json({ error: 'Partner not found' });
            }
            // Fetch package document
            const packageRef = doc(db, 'packages', packageId);
            const packageSnapshot = await getDoc(packageRef);

            if (!packageSnapshot.exists()) {
                return res.status(404).json({ error: 'Package not found' });
            }

        
            const partnerData = partnerSnapshot.data() as Partner;
            const partnerPackagesIds: string[] = []
            partnerData.packages.forEach(element => {
                partnerPackagesIds.push(element.id)
            });

            if (!partnerPackagesIds.includes(packageId)) {
                return res.status(404).json({ error: `Package ${packageId} does not exist in partner ${partnerId}` });
            }
        
            const packageData = packageSnapshot.data() as Package;
            const basePrice = packageData.price;

            // Fetch the country document from the package
            const countrySnapshot = await getDoc(packageData.country);
            const countryData = countrySnapshot.data();

            // Convert the price to the target currency
            const pricingService = new PricingService();

            let convertedPrice = 0;
            if (targetCurrency) {
                convertedPrice = await pricingService.calculatePrice(basePrice, 'USD' , targetCurrency);
            }

            // Return the package data along with the country and converted price
            const packageInfo: any = {
                size: packageData.size,
                packageName: packageData.name,
                country: countryData,
                priceType: packageData.type,
                baseCurrency: 'USD',
                basePrice,
            };

            // Only add targetCurrency if it was provided
            if (targetCurrency) {
                packageInfo.targetCurrency = targetCurrency;
                packageInfo.convertedPrice = convertedPrice;
            }
        
            // Return all the pricing data for the partner's packages
            return res.status(200).json({
                partnerId,
                partnerName: partnerData.name, // Include partner name in the response
                package: packageInfo,
            });

        } catch (error: unknown) {
            // Check if it's an instance of Error and return the correct error message
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Failed to fetch package pricing for partner' });
            }
        }
    }

}

export default partnerController;
