import { getConnection } from '@/lib/database';
import { updateClientSchema } from '@/lib/validations/client';
import { ApplicationsFinal } from '@/types';
import sql from 'mssql';
import { NextRequest, NextResponse } from 'next/server';

interface CountResult {
  count: number;
}

// Type for the validated data entries
type UpdateEntry = [string, string | number | null | undefined];

// Helper function to convert camelCase to UPPER_SNAKE_CASE
function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toUpperCase();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid client ID' },
        { status: 400 },
      );
    }

    const pool = await getConnection();
    const sqlRequest = pool.request();

    sqlRequest.input('id', sql.BigInt, id);

    const query = `
      SELECT 
        SK_ID_CURR as skIdCurr,
        TARGET as target,
        NAME_CONTRACT_TYPE as nameContractType,
        CODE_GENDER as codeGender,
        FLAG_OWN_CAR as flagOwnCar,
        FLAG_OWN_REALTY as flagOwnRealty,
        CNT_CHILDREN as cntChildren,
        AMT_INCOME_TOTAL as amtIncomeTotal,
        AMT_CREDIT as amtCredit,
        AMT_ANNUITY as amtAnnuity,
        AMT_GOODS_PRICE as amtGoodsPrice,
        DAYS_BIRTH as daysBirth,
        DAYS_EMPLOYED as daysEmployed,
        OCCUPATION_TYPE as occupationType,
        ORGANIZATION_TYPE as organizationType,
        EXT_SOURCE_1 as extSource1,
        EXT_SOURCE_2 as extSource2,
        EXT_SOURCE_3 as extSource3,
        WEEKDAY_APPR_PROCESS_START as weekdayApprProcessStart,
        HOUR_APPR_PROCESS_START as hourApprProcessStart,
        CreatedDate as createdDate
      FROM Core.Applications_Final 
      WHERE SK_ID_CURR = @id
    `;

    const result = await sqlRequest.query<ApplicationsFinal>(query);

    if (!result.recordset || result.recordset.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 },
      );
    }

    const client = result.recordset[0];

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error fetching client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid client ID' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = updateClientSchema.parse({ ...body, skIdCurr: id });

    const pool = await getConnection();

    // Check if client exists
    const existsRequest = pool.request();
    existsRequest.input('id', sql.BigInt, id);

    const existsResult = await existsRequest.query<CountResult>(
      `SELECT COUNT(*) as count FROM Core.Applications_Final WHERE SK_ID_CURR = @id`,
    );

    if (existsResult.recordset[0].count === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 },
      );
    }

    // Build update query with type-safe parameters
    const updateRequest = pool.request();
    const updateFields: string[] = [];

    // Process each field with proper typing
    Object.entries(validatedData).forEach(([key, value]: UpdateEntry) => {
      if (key !== 'skIdCurr' && value !== undefined && value !== null) {
        const dbField = camelToSnakeCase(key);
        updateFields.push(`${dbField} = @${key}`);

        // Add parameter with appropriate SQL type based on the field
        switch (key) {
          case 'target':
          case 'cntChildren':
          case 'daysBirth':
          case 'daysEmployed':
          case 'hourApprProcessStart':
            updateRequest.input(key, sql.Int, value as number);
            break;
          case 'amtIncomeTotal':
          case 'amtCredit':
          case 'amtAnnuity':
          case 'amtGoodsPrice':
            updateRequest.input(key, sql.Decimal(18, 2), value as number);
            break;
          case 'extSource1':
          case 'extSource2':
          case 'extSource3':
            updateRequest.input(key, sql.Decimal(10, 6), value as number);
            break;
          default:
            updateRequest.input(key, sql.NVarChar, value as string);
            break;
        }
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 },
      );
    }

    // Add ID parameter for WHERE clause
    updateRequest.input('whereId', sql.BigInt, id);

    const updateQuery = `
      UPDATE Core.Applications_Final 
      SET ${updateFields.join(', ')}
      WHERE SK_ID_CURR = @whereId
    `;

    await updateRequest.query(updateQuery);

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
    });
  } catch (error) {
    console.error('Error updating client:', error);
    if (error instanceof Error && error.message.includes('Validation error')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: error.message,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Error updating client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid client ID' },
        { status: 400 },
      );
    }

    const pool = await getConnection();

    // Check if client exists
    const existsRequest = pool.request();
    existsRequest.input('id', sql.BigInt, id);

    const existsResult = await existsRequest.query<CountResult>(
      `SELECT COUNT(*) as count FROM Core.Applications_Final WHERE SK_ID_CURR = @id`,
    );

    if (existsResult.recordset[0].count === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 },
      );
    }

    // Delete the client
    const deleteRequest = pool.request();
    deleteRequest.input('id', sql.BigInt, id);

    const deleteQuery = `DELETE FROM Core.Applications_Final WHERE SK_ID_CURR = @id`;
    await deleteRequest.query(deleteQuery);

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting client:', error);

    if (
      error instanceof Error &&
      (error.message.includes('REFERENCE constraint') ||
        error.message.includes('foreign key'))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete client',
          message: 'Client has related records and cannot be deleted',
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error deleting client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
