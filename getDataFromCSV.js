const getDataFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const papa = Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        }
        resolve(results.data.map((row) => {
          if (!row.id) {
            reject('Could not find valid "id" column');
          }
          if (!row.length) {
            reject('Could not find valid "length" column');
          }
          if (!row.height) {
            reject('Could not find valid "height" column');
          }
          return {
            id: row.id,
            length: +row.length,
            height: +row.height,
          }
        }));
      },
      header: true, 
      skipEmptyLines: true,
    })
  })
}
