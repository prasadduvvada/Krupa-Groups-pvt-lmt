export interface RealEstateProject {
  id?: number;
  title: string;
  location: string;
  type: 'Residential' | 'Commercial';
  status: 'For Sale' | 'For Rent' | 'Off Plan'; // Allowed 'Off Plan' here
  price: string;
  imageUrl: string;
  description: string;
  completionYear: string;
}

export interface FurnitureItem {
  id: number;
  name: string;
  category: 'Sofa' | 'Bed' | 'Dressing Table' | 'Dining';
  modelNumber: string;
  imageUrl: string;
  minOrderQuantity: number;
}

export interface OrderPayload {
  retailerName: string;
  contactNumber: string;
  items: {
    furnitureId: number;
    quantity: number;
  }[];
}