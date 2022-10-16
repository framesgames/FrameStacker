const getDataFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const papa = Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        }
        resolve(results.data.map((row) => {
          return {
            id: row.id,
            length: +row.length,
          }
        }));
      },
      header: true, 
      skipEmptyLines: true,
    })
  })
}
