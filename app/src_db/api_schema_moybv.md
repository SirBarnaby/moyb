!!!This is now old.!!!


### Base URL
```
http://localhost:5286/api/v1/
```

### Exercises Endpoints
1. **Get All Exercises**
   - Method: `GET`
   - Route: `/Exercises`
   - Response: `IEnumerable<Exercise>`
   - Description: Returns all exercises in the database

2. **Get Exercise by ID**
   - Method: `GET`
   - Route: `/Exercises/{id}`
   - Parameters: `id` (Guid)
   - Response: `Exercise`
   - Description: Returns a single exercise by its ID

3. **Search Exercises**
   - Method: `GET`
   - Route: `/Exercises/search`
   - Query Parameters: `term` (string)
   - Response: `IEnumerable<Exercise>`
   - Description: Searches exercises by name or description

4. **Get Exercises by Muscle**
   - Method: `GET`
   - Route: `/Exercises/by-muscle/{muscleId}`
   - Parameters: `muscleId` (Guid)
   - Response: `IEnumerable<Exercise>`
   - Description: Returns all exercises that target a specific muscle

### Muscles Endpoints
1. **Get All Muscles**
   - Method: `GET`
   - Route: `/Muscles`
   - Response: `IEnumerable<Muscle>`
   - Description: Returns all muscles in the database

2. **Get Muscle by ID**
   - Method: `GET`
   - Route: `/Muscles/{id}`
   - Parameters: `id` (Guid)
   - Response: `Muscle`
   - Description: Returns a single muscle by its ID

3. **Search Muscles**
   - Method: `GET`
   - Route: `/Muscles/search`
   - Query Parameters: `term` (string)
   - Response: `IEnumerable<Muscle>`
   - Description: Searches muscles by name, Latin name, or description

4. **Get Muscles by Exercise**
   - Method: `GET`
   - Route: `/Muscles/by-exercise/{exerciseId}`
   - Parameters: `exerciseId` (Guid)
   - Response: `IEnumerable<Muscle>`
   - Description: Returns all muscles targeted by a specific exercise

### Models

#### Exercise Model
```csharp
public class Exercise
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? EquipmentRequired { get; set; }
    public string? MovementType { get; set; }
    public int? Popularity { get; set; }
    public int? RangeOfMotion { get; set; }
    public string? InjuryRiskFactor { get; set; }
    public string? JointStressFactor { get; set; }
    public string? CnsFatigueFactor { get; set; }
    public bool IsUnilateral { get; set; }
    public bool IsHighSpinalLoad { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

#### Muscle Model
```csharp
public class Muscle
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? NameLatin { get; set; }
    public string? Description { get; set; }
    public string? DominantFiberType { get; set; }
    public string? EnduranceRatingFactor { get; set; }
    public string? RecoveryTimeFactor { get; set; }
    public string? NeuralDriveSensitivityFactor { get; set; }
    public string? MotorUnitRecruitmentSpeedFactor { get; set; }
    public string? StretchSensitivityFactor { get; set; }
    public string? EccentricStrengthFactor { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Additional Information
- The API uses PostgreSQL as the database
- All endpoints are versioned under `/api/v1/`
- The API includes Swagger documentation (available at `/swagger` in development)
- Error handling is implemented for all endpoints
- The API uses Entity Framework Core for data access
- All endpoints are asynchronous
- The API includes response compression for better performance
