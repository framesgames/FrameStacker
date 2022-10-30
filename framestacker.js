

window.addEventListener('load', (event) => {
  $('.droppables').droppable();
  
  /**
   * Generates Block classes that data gets stored in.
   * @param {*} data 
   * @returns 
   */
  const generateBlocks = (data) => {
    const blocks = [];
    for (const row of data) {
      blocks.push(new Block(row.id, row.length, row.height));
    }
    return blocks;
  }
  
  /**
   * Linearly scales blocks so that the maximum length is 50% of the draggable area and maximum height is 200.
   * @param {*} blocks 
   * @returns 
   */
  const scaleBlocks = (blocks) => {
    const maxLength = blocks.reduce((acc, el) => {
      if (acc < el.length) {
        acc = el.length;
      }
      return acc;
    }, -Infinity);
    const maxHeight = blocks.reduce((acc, el) => {
      if (acc < el.height) {
        acc = el.height;
      }
      return acc;
    }, -Infinity);
    blocks.forEach((block) => {
      block.length = block.length * (50 / maxLength); // values can range from 0-50
      block.height = 50 + block.height * (150 / maxHeight); // values can range from 50-200
    });
    return blocks;
  }

  
  /**
   * Actually draws a block when given a block's data
   * @param {*} block 
   */
  const drawBlock = (block) => {
    const element = $.parseHTML(`<div id="${block.frameId}" class="block block-padding">${block.frameId}</div>`);
    $('#unplaced-blocks').append(element);
    $(`#${block.frameId}`).width(`${block.length}%`);
    $(`#${block.frameId}`).css('background-color', `rgb(${block.height}, ${block.height}, ${block.height})`);
    $(`#${block.frameId}`).draggable({ revert: 'invalid' });
  }
  

  const input = document.getElementById('frames');
  input.addEventListener('change', (event) => {
    const files = event.target.files;
    Promise.all(Object.keys(files).map(fileKey => getDataFromCSV(files[fileKey])))
    .then((jaggedData) => {
      const data = jaggedData.flat();
      const blocks = scaleBlocks(generateBlocks(data));
      blocks.forEach((block) => drawBlock(block));
    })
    .catch((err) => {
      console.error(err);
      alert(err);
    });
  });
})


