#!/usr/bin/env node
// Anchor check for production Xzibit Dashboards.
// Usage: node scripts/smoke.js
// Requires Node 18+ (built-in fetch). Exit 0 = all pass, non-zero = failures.

const ROUTES = [
    {
        path: '/bonus',
        url: 'https://xzibit-dashboards.vercel.app/bonus',
        anchors: [
            'Barlow Condensed',
            'updateFreshness',
            'PROJECTED BONUS',
            'FINAL BONUS',
            'Income (1%)',
            'Gross Margin (2%)',
            'Dept Goals (2%)',
            'computeBonus',
        ]
    },
    {
        path: '/goals-summary',
        url: 'https://xzibit-dashboards.vercel.app/goals-summary',
        anchors: [
            'Barlow Condensed',
            'updateFreshness',
            'GOALS TO UNLOCK',
            'GOALS BONUS SECURED',
            'Carrying the Load',
            'Needs Support',
            'computeBonus',
        ]
    },
    {
        path: '/goals-departments',
        url: 'https://xzibit-dashboards.vercel.app/goals-departments',
        anchors: [
            'Barlow Condensed',
            'updateFreshness',
            'RANKED',
            'nav-pill',
            'computeBonus',
        ]
    }
];

async function check({ path, url, anchors }) {
    const res = await fetch(url);
    if (res.status !== 200) throw new Error('HTTP ' + res.status);
    const body = await res.text();
    if (!body.trimStart().startsWith('<!DOCTYPE html>')) throw new Error('Response is not HTML');
    const missing = anchors.filter(a => !body.includes(a));
    if (missing.length === 0) {
        console.log(path.padEnd(22) + '✓ ' + anchors.length + ' anchors');
        return true;
    }
    console.error(path.padEnd(22) + '✗ missing: ' + missing.join(', '));
    return false;
}

(async () => {
    let allPass = true;
    for (const route of ROUTES) {
        try {
            if (!await check(route)) allPass = false;
        } catch (e) {
            console.error(route.path.padEnd(22) + '✗ ERROR: ' + e.message);
            allPass = false;
        }
    }
    process.exit(allPass ? 0 : 1);
})();
