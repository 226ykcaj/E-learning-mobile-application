import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'savedNews.sqlite',
    location: 'default',
  },
  () => { console.log('Database opened successfully'); },
  error => {
    console.log('Error opening database:', error);
  }
);

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, urlToImage TEXT);',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error creating table:', error);
      }
    );
  });
};

export const insertNews = (title, description, urlToImage) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO news (title, description, urlToImage) VALUES (?, ?, ?);',
      [title, description, urlToImage],
      (tx, results) => {
        console.log('Insert Results:', results.rowsAffected);
      },
      error => {
        console.log('Error inserting news:', error);
      }
    );
  });
};

export const getSavedNews = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM news', [], (tx, results) => {
      let savedNews = [];
      for (let i = 0; i < results.rows.length; i++) {
        savedNews.push(results.rows.item(i));
      }
      console.log('Fetched Saved News:', savedNews);
      callback(savedNews);
    },
    error => {
      console.log('Error fetching news:', error);
    });
  });
};

export const deleteNews = (id) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM news WHERE id = ?',
      [id],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('News deleted successfully');
        } else {
          console.log('Failed to delete news');
        }
      },
      error => {
        console.log('Error deleting news:', error);
      }
    );
  });
};

export const updateNewsDescription = (id, newDescription) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE news SET description = ? WHERE id = ?;',
      [newDescription, id],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Description updated successfully');
        } else {
          console.log('Failed to update description');
        }
      },
      error => {
        console.log('Error updating description:', error);
      }
    );
  });
};


export default db;
