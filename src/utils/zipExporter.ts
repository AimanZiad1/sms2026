import JSZip from 'jszip';
import { flutterCodeFiles } from '../data/flutterCodebase';

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Create a clean root folder in the zip
  const flutterFolder = zip.folder('yaman_lab_flutter_project');

  flutterCodeFiles.forEach((file) => {
    if (flutterFolder) {
      flutterFolder.file(file.path, file.code);
    }
  });

  // Generate zip blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yaman_lab_flutter_project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
