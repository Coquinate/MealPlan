import LZString from 'lz-string';

/**
 * Cache Compression Utility
 * Provides compression and decompression for cache storage
 * Uses LZ-String for efficient UTF-16 string compression
 */

/**
 * Compression statistics for monitoring
 */
export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  compressionTime: number;
}

/**
 * Compress data for cache storage
 * @param data - The data to compress (will be JSON stringified)
 * @returns Compressed string and statistics
 */
export function compressForCache(data: any): {
  compressed: string;
  stats: CompressionStats;
} {
  const startTime = performance.now();

  // Convert data to JSON string
  const jsonString = JSON.stringify(data);
  const originalSize = jsonString.length * 2; // UTF-16 uses 2 bytes per character

  // Compress using LZ-String (optimized for UTF-16 storage)
  const compressed = LZString.compressToUTF16(jsonString);
  const compressedSize = compressed.length * 2;

  const compressionTime = performance.now() - startTime;
  const compressionRatio = 1 - compressedSize / originalSize;

  return {
    compressed,
    stats: {
      originalSize,
      compressedSize,
      compressionRatio,
      compressionTime,
    },
  };
}

/**
 * Decompress data from cache storage
 * @param compressed - The compressed string
 * @returns Decompressed and parsed data
 */
export function decompressFromCache<T = any>(compressed: string): T | null {
  try {
    // Decompress using LZ-String
    const decompressed = LZString.decompressFromUTF16(compressed);

    if (!decompressed) {
      console.warn('Failed to decompress cache data - invalid compressed string');
      return null;
    }

    // Parse JSON
    return JSON.parse(decompressed) as T;
  } catch (error) {
    console.error('Failed to decompress or parse cache data:', error);
    return null;
  }
}

/**
 * Check if compression would be beneficial
 * @param dataSize - Size of data in bytes
 * @returns Whether compression should be used
 */
export function shouldCompress(dataSize: number): boolean {
  // Don't compress if data is too small (overhead not worth it)
  const MIN_SIZE_FOR_COMPRESSION = 1024; // 1KB

  return dataSize >= MIN_SIZE_FOR_COMPRESSION;
}

/**
 * Calculate the size of a string in bytes (UTF-16)
 */
export function calculateStringSize(str: string): number {
  let size = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Check for surrogate pairs (emoji, etc.)
    if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate - this is part of a surrogate pair
      size += 4; // Surrogate pair takes 4 bytes
      i++; // Skip the low surrogate
    } else {
      size += 2; // Normal UTF-16 character
    }
  }
  return size;
}

/**
 * Estimate compression ratio for given data type
 * Based on empirical testing with Romanian text
 */
export function estimateCompressionRatio(content: string): number {
  // Check content characteristics
  const hasRepetition = /(.)\1{3,}/.test(content); // Repeated characters
  const hasJSON = content.includes('{') && content.includes('}');
  const hasHTML = content.includes('<') && content.includes('>');
  const length = content.length;

  // Estimate based on content type and length
  if (hasJSON) {
    // JSON typically compresses well (40-60% reduction)
    return 0.5;
  } else if (hasHTML) {
    // HTML compresses moderately (30-50% reduction)
    return 0.4;
  } else if (hasRepetition) {
    // Repetitive content compresses very well (60-80% reduction)
    return 0.7;
  } else if (length > 5000) {
    // Long text usually has patterns (30-40% reduction)
    return 0.35;
  } else {
    // Short text, less compression benefit (20-30% reduction)
    return 0.25;
  }
}

/**
 * Batch compress multiple cache entries
 */
export function batchCompress(entries: Record<string, any>): {
  compressed: Record<string, string>;
  totalStats: {
    originalSize: number;
    compressedSize: number;
    averageRatio: number;
    totalTime: number;
    itemsCompressed: number;
  };
} {
  const startTime = performance.now();
  const compressed: Record<string, string> = {};
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let itemsCompressed = 0;

  for (const [key, value] of Object.entries(entries)) {
    const jsonString = JSON.stringify(value);
    const originalSize = calculateStringSize(jsonString);

    if (shouldCompress(originalSize)) {
      const result = compressForCache(value);
      compressed[key] = result.compressed;
      totalOriginalSize += result.stats.originalSize;
      totalCompressedSize += result.stats.compressedSize;
      itemsCompressed++;
    } else {
      // Store uncompressed for small items
      compressed[key] = jsonString;
      totalOriginalSize += originalSize;
      totalCompressedSize += originalSize;
    }
  }

  const totalTime = performance.now() - startTime;
  const averageRatio = itemsCompressed > 0 ? 1 - totalCompressedSize / totalOriginalSize : 0;

  return {
    compressed,
    totalStats: {
      originalSize: totalOriginalSize,
      compressedSize: totalCompressedSize,
      averageRatio,
      totalTime,
      itemsCompressed,
    },
  };
}

/**
 * Test compression effectiveness on sample data
 */
export function testCompression(sampleData: any): {
  isEffective: boolean;
  stats: CompressionStats;
  recommendation: string;
} {
  const result = compressForCache(sampleData);
  const isEffective = result.stats.compressionRatio > 0.2; // At least 20% reduction

  let recommendation: string;
  if (result.stats.compressionRatio > 0.5) {
    recommendation = 'Highly recommended - excellent compression ratio';
  } else if (result.stats.compressionRatio > 0.3) {
    recommendation = 'Recommended - good compression ratio';
  } else if (result.stats.compressionRatio > 0.2) {
    recommendation = 'Optional - moderate compression benefit';
  } else {
    recommendation = 'Not recommended - minimal compression benefit';
  }

  return {
    isEffective,
    stats: result.stats,
    recommendation,
  };
}
