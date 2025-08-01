import { NextRequest, NextResponse } from 'next/server';
import { sentraCoreService } from '@/utils/sentraCoreService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.labels || !body.connections) {
      return NextResponse.json(
        { error: 'Missing required fields: name, labels, connections' },
        { status: 400 }
      );
    }

    const newConfiguration = sentraCoreService.createConfiguration({
      name: body.name,
      description: body.description || '',
      labels: body.labels,
      connections: body.connections,
      selected_option: body.selected_option || 'option1'
    });

    return NextResponse.json(newConfiguration, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/sentra-core/save-state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 