import { NextRequest, NextResponse } from 'next/server';
import { sentraCoreService } from '@/utils/sentraCoreService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const configuration = sentraCoreService.getConfigurationById(id);
    
    if (!configuration) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(configuration);
  } catch (error) {
    console.error('Error in GET /api/sentra-core/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.labels || !body.connections) {
      return NextResponse.json(
        { error: 'Missing required fields: name, labels, connections' },
        { status: 400 }
      );
    }

    const updatedConfiguration = sentraCoreService.updateConfiguration(id, {
      name: body.name,
      description: body.description,
      labels: body.labels,
      connections: body.connections,
      selected_option: body.selected_option
    });

    if (!updatedConfiguration) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedConfiguration);
  } catch (error) {
    console.error('Error in PUT /api/sentra-core/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 