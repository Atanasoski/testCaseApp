import { DocumentReference } from "firebase/firestore";

export type Package = {
  id: string;
  name: string;
  country: DocumentReference;
  partner: DocumentReference|null;
  size: string;
  price: number;
  type: string;
}