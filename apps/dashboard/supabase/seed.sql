-- CreditSetu — seed data, normalized to match 0002_reset_schema_text_ids.sql.
-- Same 12 applicants as apps/dashboard/src/lib/mockDataSource.js, split
-- across applicants / documents / scores / explanation_factors so mock
-- and live show the identical demo caseload either way.

begin;

insert into applicants (id, name, features, last_updated_at) values
('app-01','R. Sharma','{"avgBillAmount":2200,"rentRegularity":0.85,"utilityRegularity":0.75,"monthsHistory":16}'::jsonb,'2026-08-25T09:14:00Z'),
('app-02','A. Iyer','{"avgBillAmount":3200,"rentRegularity":0.68,"utilityRegularity":0.58,"monthsHistory":9}'::jsonb,'2026-08-24T15:40:00Z'),
('app-03','N. Verma','{"avgBillAmount":1900,"rentRegularity":0.93,"utilityRegularity":0.87,"monthsHistory":28}'::jsonb,'2026-08-25T11:02:00Z'),
('app-04','K. Reddy','{"avgBillAmount":2800,"rentRegularity":0.4,"utilityRegularity":0.42,"monthsHistory":4}'::jsonb,'2026-08-23T18:05:00Z'),
('app-05','S. Bano','{"avgBillAmount":3800,"rentRegularity":0.52,"utilityRegularity":0.6,"monthsHistory":7}'::jsonb,'2026-08-24T10:22:00Z'),
('app-06','P. Nair','{"avgBillAmount":2100,"rentRegularity":0.8,"utilityRegularity":0.68,"monthsHistory":13}'::jsonb,'2026-08-25T07:48:00Z'),
('app-07','M. Khan','{"avgBillAmount":11000,"rentRegularity":0.15,"utilityRegularity":0.18,"monthsHistory":2}'::jsonb,'2026-08-22T13:10:00Z'),
('app-08','D. Joshi','{"avgBillAmount":4800,"rentRegularity":0.7,"utilityRegularity":0.5,"monthsHistory":11}'::jsonb,'2026-08-24T19:33:00Z'),
('app-09','T. Pillai','{"avgBillAmount":2500,"rentRegularity":0.9,"utilityRegularity":0.82,"monthsHistory":24}'::jsonb,'2026-08-25T06:20:00Z'),
('app-10','V. Das','{"avgBillAmount":3000,"rentRegularity":0.48,"utilityRegularity":0.55,"monthsHistory":6}'::jsonb,'2026-08-23T21:15:00Z'),
('app-11','L. Menon','{"avgBillAmount":10500,"rentRegularity":0.18,"utilityRegularity":0.2,"monthsHistory":3}'::jsonb,'2026-08-22T08:50:00Z'),
('app-12','G. Chatterjee','{"avgBillAmount":2300,"rentRegularity":0.76,"utilityRegularity":0.72,"monthsHistory":15}'::jsonb,'2026-08-25T08:05:00Z');

insert into scores (id, applicant_id, value, band, computed_at) values
('00000000-0000-0000-0000-000000000001','app-01',90,'low','2026-08-25T09:14:00Z'),
('00000000-0000-0000-0000-000000000002','app-02',61,'medium','2026-08-24T15:40:00Z'),
('00000000-0000-0000-0000-000000000003','app-03',98,'low','2026-08-25T11:02:00Z'),
('00000000-0000-0000-0000-000000000004','app-04',18,'high','2026-08-23T18:05:00Z'),
('00000000-0000-0000-0000-000000000005','app-05',43,'medium','2026-08-24T10:22:00Z'),
('00000000-0000-0000-0000-000000000006','app-06',83,'low','2026-08-25T07:48:00Z'),
('00000000-0000-0000-0000-000000000007','app-07',2,'high','2026-08-22T13:10:00Z'),
('00000000-0000-0000-0000-000000000008','app-08',58,'medium','2026-08-24T19:33:00Z'),
('00000000-0000-0000-0000-000000000009','app-09',96,'low','2026-08-25T06:20:00Z'),
('00000000-0000-0000-0000-000000000010','app-10',35,'high','2026-08-23T21:15:00Z'),
('00000000-0000-0000-0000-000000000011','app-11',3,'high','2026-08-22T08:50:00Z'),
('00000000-0000-0000-0000-000000000012','app-12',84,'low','2026-08-25T08:05:00Z');

insert into explanation_factors (score_id, feature, label, impact_direction, magnitude, rank) values
('00000000-0000-0000-0000-000000000001','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000001','utilityRegularity','Consistent utility bill payments','positive',0.72,2),
('00000000-0000-0000-0000-000000000002','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000002','utilityRegularity','Consistent utility bill payments','positive',0.7,2),
('00000000-0000-0000-0000-000000000003','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000003','utilityRegularity','Consistent utility bill payments','positive',0.77,2),
('00000000-0000-0000-0000-000000000004','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000004','utilityRegularity','Consistent utility bill payments','positive',0.86,2),
('00000000-0000-0000-0000-000000000005','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000005','utilityRegularity','Consistent utility bill payments','positive',0.94,2),
('00000000-0000-0000-0000-000000000006','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000006','utilityRegularity','Consistent utility bill payments','positive',0.7,2),
('00000000-0000-0000-0000-000000000007','avgBillAmount','Average bill amount','negative',1,1),
('00000000-0000-0000-0000-000000000007','rentRegularity','Regular rent payments','positive',0.86,2),
('00000000-0000-0000-0000-000000000008','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000008','utilityRegularity','Consistent utility bill payments','positive',0.58,2),
('00000000-0000-0000-0000-000000000009','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000009','utilityRegularity','Consistent utility bill payments','positive',0.75,2),
('00000000-0000-0000-0000-000000000010','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000010','utilityRegularity','Consistent utility bill payments','positive',0.94,2),
('00000000-0000-0000-0000-000000000011','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000011','avgBillAmount','Average bill amount','negative',0.92,2),
('00000000-0000-0000-0000-000000000012','rentRegularity','Regular rent payments','positive',1,1),
('00000000-0000-0000-0000-000000000012','utilityRegularity','Consistent utility bill payments','positive',0.77,2);

insert into documents (id, applicant_id, type, label, uploaded_at) values
('doc-01a','app-01','electricity_bill','Electricity bill — July 2026','2026-08-01T10:00:00Z'),
('doc-01b','app-01','rent_receipt','Rent receipt — July 2026','2026-08-01T10:02:00Z'),
('doc-01c','app-01','water_bill','Water bill — July 2026','2026-08-01T10:03:00Z'),
('doc-02a','app-02','electricity_bill','Electricity bill — June 2026','2026-08-20T08:12:00Z'),
('doc-02b','app-02','rent_receipt','Rent receipt — June 2026','2026-08-20T08:15:00Z'),
('doc-03a','app-03','rent_receipt','Rent receipt — July 2026','2026-08-22T09:30:00Z'),
('doc-03b','app-03','electricity_bill','Electricity bill — July 2026','2026-08-22T09:32:00Z'),
('doc-03c','app-03','water_bill','Water bill — July 2026','2026-08-22T09:33:00Z'),
('doc-03d','app-03','ration_card','Ration card','2026-08-22T09:35:00Z'),
('doc-04a','app-04','electricity_bill','Electricity bill — May 2026','2026-08-18T14:20:00Z'),
('doc-05a','app-05','rent_receipt','Rent receipt — June 2026','2026-08-19T11:00:00Z'),
('doc-05b','app-05','informal_ledger','Shop ledger extract','2026-08-19T11:05:00Z'),
('doc-06a','app-06','electricity_bill','Electricity bill — July 2026','2026-08-21T16:40:00Z'),
('doc-06b','app-06','rent_receipt','Rent receipt — July 2026','2026-08-21T16:42:00Z'),
('doc-06c','app-06','water_bill','Water bill — July 2026','2026-08-21T16:44:00Z'),
('doc-07a','app-07','informal_ledger','Shop ledger extract','2026-08-15T09:00:00Z'),
('doc-08a','app-08','electricity_bill','Electricity bill — June 2026','2026-08-17T12:00:00Z'),
('doc-08b','app-08','rent_receipt','Rent receipt — June 2026','2026-08-17T12:02:00Z'),
('doc-08c','app-08','ration_card','Ration card','2026-08-17T12:05:00Z'),
('doc-09a','app-09','rent_receipt','Rent receipt — July 2026','2026-08-23T08:00:00Z'),
('doc-09b','app-09','electricity_bill','Electricity bill — July 2026','2026-08-23T08:02:00Z'),
('doc-09c','app-09','water_bill','Water bill — July 2026','2026-08-23T08:04:00Z'),
('doc-09d','app-09','informal_ledger','Shop ledger extract','2026-08-23T08:06:00Z'),
('doc-10a','app-10','electricity_bill','Electricity bill — May 2026','2026-08-16T10:30:00Z'),
('doc-10b','app-10','ration_card','Ration card','2026-08-16T10:33:00Z'),
('doc-11a','app-11','informal_ledger','Shop ledger extract','2026-08-14T13:45:00Z'),
('doc-11b','app-11','ration_card','Ration card','2026-08-14T13:48:00Z'),
('doc-12a','app-12','electricity_bill','Electricity bill — July 2026','2026-08-24T17:10:00Z'),
('doc-12b','app-12','rent_receipt','Rent receipt — July 2026','2026-08-24T17:12:00Z'),
('doc-12c','app-12','water_bill','Water bill — July 2026','2026-08-24T17:14:00Z');

commit;