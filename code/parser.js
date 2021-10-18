
//create a button (similar to how loadFile does it), to load a serialized blockchain from a file
function parse_blockchain_file(app, id) {
	const label = document.createElement('div');
	label.innerText="Blockchain file parser:";
	const fileInput = document.createElement('input');
	const reader = new FileReader();

	// Configure the fileInput:
	fileInput.type = 'file';
	fileInput.id = id;

	// Resolve the output once the file has been uploaded & processed:
	return new Promise(resolve => {
		fileInput.addEventListener('change', function(fileEvent) {
			// Ensure that a valid file selection was made:
			if(fileEvent.target.files.length !=1)
				return console.warn('Received invalid file set');

			// Read the contents of the file:
			reader.addEventListener('load', async function(readEvent) {
				// Isolate each address entry in the list:
				const lines = readEvent.target.result
					.split(/(\n|\r)/)
					.filter(elem => !/^\s*$/.test(elem));
				console.log(lines);
				//parse blocks until there are no lines left
				const blockchain=[];
				while(lines.length>0){
					//find next block
					const block_start=lines.indexOf("BEGIN BLOCK");
					const block_end=lines.indexOf("END BLOCK");
					if(block_start>=0 && block_end>block_start){
						// lines for this block
						const block_lines=lines.slice(block_start+1,block_end);
						// find header
						const header_start=lines.indexOf("BEGIN HEADER");
						const header_end=lines.indexOf("END HEADER");
						if(header_start>=0 && header_end>header_start){
							// lines for this header
							const header_lines=lines.slice(header_start+1,header_end);
							console.log(header_lines);
							const prev_hash=header_lines.shift();
							const root_hash=header_lines.shift();
							//TODO:verify timestamp
							const timestamp=parseInt(header_lines.shift());
							const target=header_lines.shift();
							const nonce=header_lines.shift();
							// remaining block lines are accounts
							console.log(header_start,header_end);
							block_lines.splice(header_start-1,header_end-header_start+1);
							console.log(block_lines);
							//TODO:verify balances
							const accountSets=block_lines.map(addr => {
								return {
									address: addr.split(/\s+/)[0],
									balance: parseInt(addr.split(/\s+/)[1])
								}
							});
							console.log(accountSets);
							console.log("treeing");
							//return Promise.reject("bleh");
							const accounts=await Promise.all(accountSets.map(set=>mktree(set)));
							console.log("treeing");
							console.log(block_lines);
							console.log(accounts);
							const block = new Block(prev_hash, root_hash, timestamp, accounts, target, nonce);
							blockchain.push(block);
						}
						else{
							return Promise.reject("bad header");
						}
						// remaining blockchain lines
						lines.splice(block_start,block_end-block_start+1);
					}
					else{
						return Promise.reject("bad block");
					}
				}

				// Return the blockchain
				console.log(blockchain);
				resolve(blockchain);
			});

			// Read the files as text:
			reader.readAsText(fileEvent.target.files[0]);
		});

		// Create the file input element:
		app.appendChild(label)
		app.appendChild(fileInput)
	});
}
