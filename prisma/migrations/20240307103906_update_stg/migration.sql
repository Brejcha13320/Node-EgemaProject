-- DropForeignKey
ALTER TABLE `Propuesta` DROP FOREIGN KEY `Propuesta_comiteId_fkey`;

-- DropForeignKey
ALTER TABLE `Propuesta` DROP FOREIGN KEY `Propuesta_propuesta_fkey`;

-- AlterTable
ALTER TABLE `Propuesta` MODIFY `comiteId` VARCHAR(191) NULL,
    MODIFY `propuesta` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SolicitudTrabajoGrado` ADD COLUMN `adminId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `SolicitudTrabajoGrado` ADD CONSTRAINT `SolicitudTrabajoGrado_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propuesta` ADD CONSTRAINT `Propuesta_propuesta_fkey` FOREIGN KEY (`propuesta`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propuesta` ADD CONSTRAINT `Propuesta_comiteId_fkey` FOREIGN KEY (`comiteId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
