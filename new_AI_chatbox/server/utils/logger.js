/**
 * Privacy-Compliant Logger (ESM Version)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log anonymous metadata
 * @param {string} emotion - Emotion category
 * @param {string} intensity - Intensity level
 */
export function logMetadata(emotion, intensity) {
    const metadata = {
        emotion,
        intensity,
        timestamp: new Date().toISOString()
    };

    const logEntry = JSON.stringify(metadata) + '\n';
    const logFile = path.join(logsDir, 'metadata.log');

    try {
        fs.appendFileSync(logFile, logEntry, 'utf8');
    } catch (error) {
        console.error('Failed to write log:', error.message);
    }
}

/**
 * Get aggregated statistics
 * @returns {Object} - Aggregated stats
 */
export function getStats() {
    const logFile = path.join(logsDir, 'metadata.log');

    if (!fs.existsSync(logFile)) {
        return {
            total: 0,
            emotions: {},
            intensities: {}
        };
    }

    try {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n').filter(line => line);

        const stats = {
            total: lines.length,
            emotions: {},
            intensities: {}
        };

        lines.forEach(line => {
            try {
                const entry = JSON.parse(line);
                stats.emotions[entry.emotion] = (stats.emotions[entry.emotion] || 0) + 1;
                stats.intensities[entry.intensity] = (stats.intensities[entry.intensity] || 0) + 1;
            } catch (e) {
                // Skip malformed lines
            }
        });

        return stats;
    } catch (error) {
        console.error('Failed to read stats:', error.message);
        return {
            total: 0,
            emotions: {},
            intensities: {}
        };
    }
}
