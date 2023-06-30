import { GetAqp } from '~decorators/get-aqp.decorator';
import { Public } from '~decorators/public.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~utils/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { GetCurrentUser } from '~decorators/get-current-user';
import { TokenPayload } from '~routes/pre-built/5-tokens/interface';
import { AuthorDto } from './dto/author.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.commentService.find(filter, options);
  }

  @HttpCode(201)
  @Post('')
  async create(@GetCurrentUser() user: TokenPayload, @Body() body: CreateCommentDto) {
    const author: AuthorDto = {
      _id: user._id,
      avatar: user.avatar,
      fullName: user.fullName,
    };

    return this.commentService.create({ ...body, author });
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() body: UpdateCommentDto) {
    return this.commentService.updateById(id, body);
  }

  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.commentService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.commentService.deleteById(id);
  }

  @Public()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    return this.commentService.paginate(filter, options);
  }

  @Public()
  @Get('count')
  async count(@GetAqp('filter') filter: AqpDto) {
    return this.commentService.count(filter);
  }

  @Public()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetAqp() { projection, populate }: AqpDto,
  ) {
    return this.commentService.findById(id, { projection, populate });
  }
}
