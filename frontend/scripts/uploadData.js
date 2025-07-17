import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
    apiKey: "AIzaSyAjgircs1OZfvCnvo2GNA3y2-UYRcy-W4k",
    authDomain: "vizy-12155.firebaseapp.com",
    databaseURL: "https://vizy-12155-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vizy-12155",
    storageBucket: "vizy-12155.firebasestorage.app",
    messagingSenderId: "207196912841",
    appId: "1:207196912841:web:005f743a35c5149d882118",
    measurementId: "G-Q1JJF9C716"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const immigrationOfficesPath = path.join(__dirname, '../src/components/locator-component/map-component/immigration-offices.json');
const photoBoothPath = path.join(__dirname, '../src/components/locator-component/map-component/photo-booth.json');

const immigrationOffices = JSON.parse(fs.readFileSync(immigrationOfficesPath, 'utf8'));
const photoBoothData = JSON.parse(fs.readFileSync(photoBoothPath, 'utf8'));

const uploadImmigrationOffices = async () => {
    try {
        await set(ref(database, 'immigration-offices'), immigrationOffices);
    } catch (error) {
        console.error('Error uploading immigration offices:', error);
    }
};

const uploadPhotoBooths = async () => {
    try {
        await set(ref(database, 'photo-booths'), photoBoothData.data);
    } catch (error) {
        console.error('Error uploading photo booths:', error);
    }
};

const uploadAllData = async () => {
    await uploadImmigrationOffices();
    await uploadPhotoBooths();
};

uploadAllData().catch(console.error); 