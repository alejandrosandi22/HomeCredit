import { getConnection } from '@/lib/database';
import { createClientSchema } from '@/lib/validations/client';
import { ApplicationsFinal } from '@/types';
import sql from 'mssql';
import { NextRequest, NextResponse } from 'next/server';

interface CountResult {
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    const pool = await getConnection();
    const sqlRequest = pool.request();

    let whereClause = '';

    if (search) {
      whereClause = `
        WHERE 
          CAST(SK_ID_CURR AS NVARCHAR) LIKE @search 
          OR OCCUPATION_TYPE LIKE @search 
          OR ORGANIZATION_TYPE LIKE @search 
          OR CODE_GENDER LIKE @search
      `;
      sqlRequest.input('search', sql.NVarChar, `%${search}%`);
    }

    // Add pagination parameters
    sqlRequest.input('offset', sql.Int, offset);
    sqlRequest.input('limit', sql.Int, limit);

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM Core.Applications_Final 
      ${whereClause}
    `;

    // Data query with OFFSET/FETCH
    const dataQuery = `
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
      ${whereClause}
      ORDER BY SK_ID_CURR DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    // Execute queries
    const countResult = await sqlRequest.query<CountResult>(countQuery);
    const dataResult = await sqlRequest.query<ApplicationsFinal>(dataQuery);

    const total = countResult.recordset[0]?.total || 0;
    const clients = dataResult.recordset;

    return NextResponse.json({
      success: true,
      data: {
        clients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error fetching clients',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    const pool = await getConnection();
    const sqlRequest = pool.request();

    // Add all parameters with proper types
    sqlRequest.input('skIdCurr', sql.BigInt, validatedData.skIdCurr);
    sqlRequest.input('target', sql.Int, validatedData.target);
    sqlRequest.input(
      'nameContractType',
      sql.NVarChar,
      validatedData.nameContractType,
    );
    sqlRequest.input('codeGender', sql.NVarChar, validatedData.codeGender);
    sqlRequest.input('flagOwnCar', sql.NVarChar, validatedData.flagOwnCar);
    sqlRequest.input(
      'flagOwnRealty',
      sql.NVarChar,
      validatedData.flagOwnRealty,
    );
    sqlRequest.input('cntChildren', sql.Int, validatedData.cntChildren);
    sqlRequest.input(
      'amtIncomeTotal',
      sql.Decimal(18, 2),
      validatedData.amtIncomeTotal,
    );
    sqlRequest.input('amtCredit', sql.Decimal(18, 2), validatedData.amtCredit);
    sqlRequest.input(
      'amtAnnuity',
      sql.Decimal(18, 2),
      validatedData.amtAnnuity,
    );
    sqlRequest.input(
      'amtGoodsPrice',
      sql.Decimal(18, 2),
      validatedData.amtGoodsPrice,
    );
    sqlRequest.input('daysBirth', sql.Int, validatedData.daysBirth);
    sqlRequest.input('daysEmployed', sql.Int, validatedData.daysEmployed);
    sqlRequest.input(
      'occupationType',
      sql.NVarChar,
      validatedData.occupationType,
    );
    sqlRequest.input(
      'organizationType',
      sql.NVarChar,
      validatedData.organizationType,
    );
    sqlRequest.input(
      'extSource1',
      sql.Decimal(10, 6),
      validatedData.extSource1,
    );
    sqlRequest.input(
      'extSource2',
      sql.Decimal(10, 6),
      validatedData.extSource2,
    );
    sqlRequest.input(
      'extSource3',
      sql.Decimal(10, 6),
      validatedData.extSource3,
    );
    sqlRequest.input(
      'weekdayApprProcessStart',
      sql.NVarChar,
      validatedData.weekdayApprProcessStart,
    );
    sqlRequest.input(
      'hourApprProcessStart',
      sql.Int,
      validatedData.hourApprProcessStart,
    );

    const insertQuery = `
      INSERT INTO Core.Applications_Final (
        SK_ID_CURR, TARGET, NAME_CONTRACT_TYPE, CODE_GENDER,
        FLAG_OWN_CAR, FLAG_OWN_REALTY, CNT_CHILDREN,
        AMT_INCOME_TOTAL, AMT_CREDIT, AMT_ANNUITY, AMT_GOODS_PRICE,
        DAYS_BIRTH, DAYS_EMPLOYED, OCCUPATION_TYPE, ORGANIZATION_TYPE,
        EXT_SOURCE_1, EXT_SOURCE_2, EXT_SOURCE_3,
        WEEKDAY_APPR_PROCESS_START, HOUR_APPR_PROCESS_START
      ) VALUES (
        @skIdCurr, @target, @nameContractType, @codeGender,
        @flagOwnCar, @flagOwnRealty, @cntChildren,
        @amtIncomeTotal, @amtCredit, @amtAnnuity, @amtGoodsPrice,
        @daysBirth, @daysEmployed, @occupationType, @organizationType,
        @extSource1, @extSource2, @extSource3,
        @weekdayApprProcessStart, @hourApprProcessStart
      )
    `;

    await sqlRequest.query(insertQuery);

    return NextResponse.json(
      {
        success: true,
        message: 'Client created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating client:', error);

    if (
      error instanceof Error &&
      error.message.includes('Violation of PRIMARY KEY constraint')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client ID already exists',
          message: 'A client with this ID already exists in the system',
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error creating client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
