import { archiveMapping } from '../archive/archive-mapping';
import { downloadArtifact } from '../download/download-artifact';
import { storeStubEntries } from './stubs-entries';
import { remoteStubs } from './stubs-config';
import { logger } from '../utils/debug';

/**
 * Get all remote stubs entries
 */
export function getRemoteStubs(): void {
  logger.debug('stubs:remote', `${remoteStubs.length} remote stubs configured`);

  remoteStubs.forEach(async (stubConfig) => {
    try {
      const archivePath = await downloadArtifact(stubConfig);

      if (archivePath) {
        const stubs = await archiveMapping(archivePath);
        logger.debug('stubs:entries', `${stubs.length} stubs found in ${stubConfig.id}`);
        storeStubEntries(stubs);
      } else {
        logger.error(`No remote stub found! ${stubConfig.id}`);
      }
    } catch (err) {
      logger.error(err);
    }
  });
}