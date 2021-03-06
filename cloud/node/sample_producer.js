// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

const Pulsar = require('pulsar-client');

const auth_params = process.env.AUTH_PARAMS;
const service_url = process.env.SERVICE_URL;

(async () => {
    const auth = new Pulsar.AuthenticationToken({
        token: auth_params,
    });

    // Create a client
    const client = new Pulsar.Client({
        serviceUrl: service_url,
        authentication: auth,
        operationTimeoutSeconds: 30,
    });

    // Create a producer
    const producer = await client.createProducer({
        topic: 'persistent://public/default/my-topic',
        sendTimeoutMs: 30000,
        batchingEnabled: true,
    });

    // Send messages
    for (let i = 0; i < 10; i += 1) {
        const msg = `my-message-${i}`;
        producer.send({
            data: Buffer.from(msg),
        });
        console.log(`Sent message: ${msg}`);
    }
    await producer.flush();

    await producer.close();
    await client.close();
})();
