import { DocumentReference } from "firebase/firestore";

export type Partner = {
  id: string;
  name: string;
  packages: DocumentReference[];
}