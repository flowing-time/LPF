import locationsData from './data/locations.json';
import { LibraryBranch } from './types';

export const LOCATIONS = locationsData as LibraryBranch[];

export const LIBRARY_CONFIGS = [
    {
        id: 'sjpl',
        systemName: 'San José Public Library',
        apiId: 'sjpl',
        catalogUrl: 'https://sjpl.bibliocommons.com',
        passes: [
            { type: 'caState', bibId: 'S156C6422417' },
            // SJPL doesn't seem to have County Pass widely advertised or shared ID
        ]
    },
    {
        id: 'sccl',
        systemName: 'Santa Clara County Library District',
        apiId: 'sccl',
        catalogUrl: 'https://sccl.bibliocommons.com',
        passes: [
            { type: 'caState', bibId: 'S118C1014941' },
            { type: 'sccCounty', bibId: 'S118C1019385' }
        ]
    },
    {
        id: 'sclibrary',
        systemName: 'Santa Clara City Library',
        apiId: 'sclibrary',
        catalogUrl: 'https://sclibrary.bibliocommons.com',
        passes: [
            { type: 'caState', bibId: 'S146C2454429' },
            { type: 'sccCounty', bibId: 'S146C2538775' }
        ]
    },
    {
        id: 'mv',
        systemName: 'Mountain View Public Library',
        apiId: 'mv', // Custom handler
        catalogUrl: 'https://librarycatalog.mountainview.gov',
        passes: [
            { type: 'caState', bibId: '3087456' }
        ]
    }
];
