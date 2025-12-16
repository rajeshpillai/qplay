import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 20 }, // Ramp up to 20 users
        { duration: '30s', target: 20 }, // Stay at 20 users
        { duration: '10s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // http errors should be less than 1%
    },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
    // 1. Check Server Health
    const healthRes = http.get(`http://localhost:5000/health/metrics`);
    check(healthRes, { 'health_ok': (r) => r.status === 200 });

    // 2. Perform KYC Verify (Happy Path)
    const payload = JSON.stringify({
        userId: 'user_123',
        image: 'base64_fake_image_data'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            // Chaos Headers (Optional)
            'x-sim-latency': Math.floor(Math.random() * 50).toString(), // 0-50ms random latency
            'x-sim-error-rate': '0.005' // 0.5% chance of random 500
        },
    };

    const res = http.post(`${BASE_URL}/v1/kyc/verify`, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'transaction present': (r) => r.json().transactionId !== undefined
    });

    sleep(1);
}
