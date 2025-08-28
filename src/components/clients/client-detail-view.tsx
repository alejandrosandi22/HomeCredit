'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { ApplicationsFinal } from '@/types';

interface ClientDetailViewProps {
  client: ApplicationsFinal;
}

export default function ClientDetailView({ client }: ClientDetailViewProps) {
  const getTargetBadge = (target: number | null) => {
    if (target === null) return <Badge variant='secondary'>Unknown</Badge>;
    return target === 1 ? (
      <Badge variant='destructive'>Default Risk</Badge>
    ) : (
      <Badge variant='default'>No Risk</Badge>
    );
  };

  const getBooleanDisplay = (value: number | null) => {
    if (value === null) return 'Unknown';
    return value === 1 ? 'Yes' : 'No';
  };

  const getEmploymentYears = (daysEmployed: number | null) => {
    if (!daysEmployed) return 'Unknown';
    const years = Math.abs(daysEmployed) / 365;
    return `${Math.round(years * 10) / 10} years`;
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Client {client.skIdCurr}</h2>
          <p className='text-muted-foreground'>
            Created: {client.createdDate?.toDateString() ?? 'Unknown'}
          </p>
        </div>
        <div className='space-x-2'>
          {getTargetBadge(client.target)}
          <Badge variant='outline'>
            {client.nameContractType || 'Unknown Contract'}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Target Risk:</span>
              <span className='text-sm'>{getTargetBadge(client.target)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Assets Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assets & Property</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Owns Car:</span>
              <span className='text-sm'>
                {getBooleanDisplay(client.flagOwnCar)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Owns Realty:</span>
              <span className='text-sm'>
                {getBooleanDisplay(client.flagOwnRealty)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Occupation:</span>
              <span className='text-sm'>
                {client.occupationType || 'Not specified'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Organization:</span>
              <span className='text-sm'>
                {client.organizationType || 'Not specified'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Employment Duration:</span>
              <span className='text-sm'>
                {getEmploymentYears(client.daysEmployed)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* External Credit Sources */}
        <Card>
          <CardHeader>
            <CardTitle>External Credit Sources</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>External Source 1:</span>
              <span className='font-mono text-sm'>
                {client.extSource1 !== null
                  ? client.extSource1.toFixed(6)
                  : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>External Source 2:</span>
              <span className='font-mono text-sm'>
                {client.extSource2 !== null
                  ? client.extSource2.toFixed(6)
                  : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>External Source 3:</span>
              <span className='font-mono text-sm'>
                {client.extSource3 !== null
                  ? client.extSource3.toFixed(6)
                  : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Application Process Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Application Day:</span>
              <span className='text-sm'>
                {client.weekdayApprProcessStart || 'Unknown'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium'>Application Hour:</span>
              <span className='text-sm'>
                {client.hourApprProcessStart !== null
                  ? `${client.hourApprProcessStart}:00`
                  : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Summary */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Credit Ratios</h4>
                <div className='text-muted-foreground space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Credit to Income Ratio:</span>
                    <span className='font-mono'>
                      {client.amtCredit && client.amtIncomeTotal
                        ? `${((client.amtCredit / client.amtIncomeTotal) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Annuity to Credit Ratio:</span>
                    <span className='font-mono'>
                      {client.amtAnnuity && client.amtCredit
                        ? `${((client.amtAnnuity / client.amtCredit) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Annuity to Income Ratio:</span>
                    <span className='font-mono'>
                      {client.amtAnnuity && client.amtIncomeTotal
                        ? `${((client.amtAnnuity / client.amtIncomeTotal) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Demographics Analysis</h4>
                <div className='text-muted-foreground space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Age Group:</span>
                    <span>
                      {client.daysBirth
                        ? (() => {
                            const age = Math.abs(client.daysBirth) / 365;
                            if (age < 25) return 'Very Young (< 25)';
                            if (age < 35) return 'Young (25-35)';
                            if (age < 50) return 'Middle-aged (35-50)';
                            if (age < 65) return 'Mature (50-65)';
                            return 'Senior (65+)';
                          })()
                        : 'Unknown'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Family Status:</span>
                    <span>
                      {client.cntChildren !== null
                        ? client.cntChildren === 0
                          ? 'No children'
                          : `${client.cntChildren} ${client.cntChildren === 1 ? 'child' : 'children'}`
                        : 'Unknown'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Asset Ownership:</span>
                    <span>
                      {(() => {
                        const ownsCar = client.flagOwnCar === 1;
                        const ownsRealty = client.flagOwnRealty === 1;
                        if (ownsCar && ownsRealty) return 'Car & Realty';
                        if (ownsCar) return 'Car only';
                        if (ownsRealty) return 'Realty only';
                        if (
                          client.flagOwnCar === 0 &&
                          client.flagOwnRealty === 0
                        )
                          return 'No assets';
                        return 'Unknown';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>External Credit Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Credit Bureau Scores</h4>
                <div className='text-muted-foreground space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Sources Available:</span>
                    <span className='font-mono'>
                      {
                        [
                          client.extSource1,
                          client.extSource2,
                          client.extSource3,
                        ].filter((source) => source !== null).length
                      }{' '}
                      / 3
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Average Score:</span>
                    <span className='font-mono'>
                      {(() => {
                        const sources = [
                          client.extSource1,
                          client.extSource2,
                          client.extSource3,
                        ].filter((source) => source !== null) as number[];
                        return sources.length > 0
                          ? (
                              sources.reduce((sum, source) => sum + source, 0) /
                              sources.length
                            ).toFixed(4)
                          : 'N/A';
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Individual Scores</h4>
                <div className='space-y-2'>
                  {[
                    { label: 'External Source 1', value: client.extSource1 },
                    { label: 'External Source 2', value: client.extSource2 },
                    { label: 'External Source 3', value: client.extSource3 },
                  ].map((source, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <span className='text-muted-foreground text-sm'>
                        {source.label}:
                      </span>
                      <div className='flex items-center space-x-2'>
                        <span className='font-mono text-sm'>
                          {source.value !== null
                            ? source.value.toFixed(6)
                            : 'N/A'}
                        </span>
                        {source.value !== null && (
                          <div className='bg-muted h-2 w-16 rounded-full'>
                            <div
                              className={`h-full rounded-full ${
                                source.value > 0.7
                                  ? 'bg-green-500'
                                  : source.value > 0.4
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${source.value * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Credit Risk Indicators</h4>
                <div className='text-muted-foreground space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Primary Risk Factor:</span>
                    <span>
                      {client.target === 1
                        ? 'High Default Risk'
                        : client.target === 0
                          ? 'Low Default Risk'
                          : 'Unknown'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Employment Stability:</span>
                    <span>
                      {client.daysEmployed
                        ? (() => {
                            const years = Math.abs(client.daysEmployed) / 365;
                            if (years > 10) return 'Very Stable (10+ years)';
                            if (years > 5) return 'Stable (5+ years)';
                            if (years > 2) return 'Moderate (2+ years)';
                            if (years > 1) return 'Recent (1+ years)';
                            return 'New (< 1 year)';
                          })()
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {client.amtCredit ? client.amtCredit : 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>
                Requested Credit
              </div>
            </div>

            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {client.amtIncomeTotal ? client.amtIncomeTotal : 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>Annual Income</div>
            </div>

            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {client.amtAnnuity ? client.amtAnnuity : 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>Loan Annuity</div>
            </div>

            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {client.amtGoodsPrice ? client.amtGoodsPrice : 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>Goods Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <h4 className='text-sm font-medium'>Application Details</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    Application Day:
                  </span>
                  <span className='capitalize'>
                    {client.weekdayApprProcessStart?.toLowerCase() || 'Unknown'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    Application Time:
                  </span>
                  <span>
                    {client.hourApprProcessStart !== null
                      ? `${client.hourApprProcessStart.toString().padStart(2, '0')}:00 ${
                          client.hourApprProcessStart < 12 ? 'AM' : 'PM'
                        }`
                      : 'Unknown'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Record Created:</span>
                  <span>{formatDate(client.createdDate)}</span>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <h4 className='text-sm font-medium'>Risk Assessment</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Default Risk:</span>
                  {getTargetBadge(client.target)}
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Risk Score:</span>
                  <span className='font-mono'>
                    {(() => {
                      const sources = [
                        client.extSource1,
                        client.extSource2,
                        client.extSource3,
                      ].filter((source) => source !== null) as number[];
                      if (sources.length === 0) return 'N/A';
                      const avg =
                        sources.reduce((sum, source) => sum + source, 0) /
                        sources.length;
                      return `${(avg * 100).toFixed(1)}/100`;
                    })()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    Credit Utilization:
                  </span>
                  <span className='font-mono'>
                    {client.amtCredit && client.amtIncomeTotal
                      ? `${((client.amtCredit / client.amtIncomeTotal) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
