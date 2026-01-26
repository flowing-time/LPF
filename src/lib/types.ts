export type LibrarySystem = 'SJPL' | 'SCCLD' | 'MountainView' | 'SantaClaraCity';

export interface LibraryBranch {
  id: string; // unique: system-branchId
  name: string;
  system: string; // Changed to string to match JSON import, or keep strict if JSON matches
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  url?: string;
}

export interface Availability {
  branchName: string;
  available: number;
  total: number;
  status: 'Available' | 'Unavailable' | 'Check Library';
}

export interface LibraryAvailability extends LibraryBranch {
  availability: {
    caStatePass: Availability;
    sccCountyPass: Availability;
  }
}
