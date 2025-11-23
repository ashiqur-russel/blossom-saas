# API


```
modules/
  weeks/
    dtos/
      create-week.dto.ts      ✅ Request DTO
      update-week.dto.ts       ✅ Update DTO
      week-response.dto.ts     ✅ Response DTO
      week-summary.dto.ts      ✅ Summary DTO
    schemas/
      week.schema.ts           ✅ MongoDB Schema
    weeks.controller.ts        ✅ HTTP Controller
    weeks.service.ts           ✅ Business Logic
    weeks.module.ts            ✅ Feature Module
```
## Endpoints

All endpoints use `/flower-weeks`:
- `GET /flower-weeks` - Get all weeks
- `GET /flower-weeks/:id` - Get week by ID
- `POST /flower-weeks` - Create week
- `PATCH /flower-weeks/:id` - Update week
- `DELETE /flower-weeks/:id` - Delete week
- `GET /flower-weeks/summary` - Get summary



