-- DropIndex
DROP INDEX `SolicitudTrabajoGrado_propuestaId_fkey` ON `SolicitudTrabajoGrado`;

-- AlterTable
ALTER TABLE `Propuesta` MODIFY `comiteId` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Propuesta` ADD CONSTRAINT `Propuesta_comiteId_fkey` FOREIGN KEY (`comiteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
