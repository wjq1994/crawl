# elasticsearch 全文搜索引擎

### 一、安装服务器

```bash
mac环境
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.1-darwin-x86_64.tar.gz
tar -xzvf elasticsearch-7.6.1-darwin-x86_64.tar.gz
cd elasticsearch-7.6.1
./bin/elasticsearch
```

### 二、安装客户端

```javascript
npm install elasticsearch
```

### 三、基本使用

```javascript
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200', log: "trace"});

//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/update_examples.html
//https://www.elastic.co/guide/en/elasticsearch/reference/7.x/docs-index_.html

//RESTFUL访问：http://localhost:9200/game-of-thrones/_doc/1
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
```
