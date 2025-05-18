import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('foto');

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'O arquivo deve ser uma imagem' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueId = uuidv4();
    const extension = file.name.split('.').pop();
    const fileName = `${uniqueId}.${extension}`;

    // Criar pasta de uploads se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadDir, fileName), buffer);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Se a pasta não existir, criar
        const { mkdir } = await import('fs/promises');
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, fileName), buffer);
      } else {
        throw error;
      }
    }

    // Retornar URL relativa da imagem
    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da foto' },
      { status: 500 }
    );
  }
} 