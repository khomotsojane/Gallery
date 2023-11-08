import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'photo.db', createFromLocation: 1 });

export default db;
