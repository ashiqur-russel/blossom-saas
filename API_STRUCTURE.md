# API Structure - NestJS Best Practices

## Module Structure

```
modules/
  weeks/
    dtos/
      create-week.dto.ts
      update-week.dto.ts
      week-response.dto.ts
      week-summary.dto.ts
    schemas/
      week.schema.ts
    weeks.controller.ts
    weeks.service.ts
    weeks.service.spec.ts
    weeks.module.ts
```

## Principles Applied

1. **Feature Module**: Each feature has its own module (weeks)
2. **DTOs Folder**: All DTOs organized in `dtos/` folder
3. **Schemas Folder**: MongoDB schemas in `schemas/` folder
4. **Service**: Business logic in service
5. **Controller**: Thin controllers, delegates to services
6. **Tests**: Test files alongside source files (`.spec.ts`)
7. **Naming**: Consistent naming (weeks.service.ts, weeks.controller.ts)

## File Naming Convention

- Module: `weeks.module.ts`
- Service: `weeks.service.ts`
- Controller: `weeks.controller.ts`
- DTOs: `create-week.dto.ts`, `update-week.dto.ts`
- Schema: `week.schema.ts`
- Tests: `weeks.service.spec.ts`

## Endpoints

- `GET /flower-weeks` - Get all weeks
- `GET /flower-weeks/:id` - Get week by ID
- `POST /flower-weeks` - Create week
- `PATCH /flower-weeks/:id` - Update week
- `DELETE /flower-weeks/:id` - Delete week
- `GET /flower-weeks/summary` - Get summary

