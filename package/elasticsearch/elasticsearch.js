const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200', log: "trace"});

//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/update_examples.html
async function run () {
    let aad = await client.index({
      index: 'game-of-thrones',
      id: '1',
      body: {
        character: 'Ned Stark',
        quote: 'Winter is coming.',
        isAlive: true
      }
    })
  
    await client.update({
      index: 'game-of-thrones',
      id: '1',
      body: {
        doc: {
            character: 'wang',
            quote: 'spring is coming.',
            isAlive: false
        }
      }
    })

    // let deleted = await client.delete({
    //     index: 'game-of-thrones',
    //     id: '1'
    // })
  
    let result = await client.search({
        index: 'game-of-thrones',
        body: {
            query: {
                match: {
                  character: 'wang'
                }
            }
        }
    });
    console.log(result);
  }
  
run().catch(console.log)