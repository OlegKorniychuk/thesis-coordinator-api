/*
  Warnings:

  - A unique constraint covering the columns `[bachelor_id,supervisor_id]` on the table `SupervisionRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupervisionRequest_bachelor_id_supervisor_id_key" ON "SupervisionRequest"("bachelor_id", "supervisor_id");
