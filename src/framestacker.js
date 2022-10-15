const generateRandomBlocks = (data, canvas, context) => {
  const blocks = [];
  for (const row of data) {
    let coords;
    do {
      coords = new Coords(
        0.4 * Math.random(),
        0.1 + 0.8 * Math.random(),
        row.length,
        0.03,
      )
    } while(blocks.find(existingBlock => coords.isCollided(existingBlock.coords)));
    blocks.push(new Block(coords, row.id, canvas, context));
  }
  return blocks;
}

const initialiseMouseHandlers = (canvas, blocks) => {
  canvas.onmousedown = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / canvas.clientWidth;
    const y = (event.clientY - rect.top) / canvas.clientHeight;
    const block = blocks.find(block => block.isClicked(x, y));
    if (block) {
      block.drag();
    }
  }
  canvas.onmousemove = (event) => {
    console.log(event);
  }
}

window.addEventListener('load', (event) => {
  const input = document.getElementById('frames');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.font = '20px Arial';
  
  input.addEventListener('change', (event) => {
    const files = event.target.files;
    Promise.all(Object.keys(files).map(fileKey => getDataFromCSV(files[fileKey])))
    .then((jaggedData) => {
      const data = jaggedData.flat();
      const blocks = generateRandomBlocks(data, canvas, context);
      blocks.forEach(block => block.draw());
      initialiseMouseHandlers(canvas, blocks)
    })
    .catch(err => console.error(err));

  });
})


