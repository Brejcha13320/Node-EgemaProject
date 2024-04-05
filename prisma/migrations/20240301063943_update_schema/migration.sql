-- DropForeignKey
ALTER TABLE `SolicitudTrabajoGrado` DROP FOREIGN KEY `SolicitudTrabajoGrado_propuestaId_fkey`;

-- AlterTable
ALTER TABLE `SolicitudTrabajoGrado` MODIFY `propuestaId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Propuesta` ADD CONSTRAINT `Propuesta_propuesta_fkey` FOREIGN KEY (`propuesta`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
