export class GenerateTemplateImageDto {
  templateId: string; // Changed from template to templateId
  dynamicContent: Record<string, string>;
}
