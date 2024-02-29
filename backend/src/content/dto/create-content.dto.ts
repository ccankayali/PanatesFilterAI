/* eslint-disable prettier/prettier */
import { SafeSearchResponse } from "../content.service";

export class CreateImageDto {
  imageUrl: string;
  analysisResults: SafeSearchResponse;
}